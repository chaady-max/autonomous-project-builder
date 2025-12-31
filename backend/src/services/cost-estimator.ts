import {
  ProjectSummary,
  ResearchResult,
  InputEnrichment,
  CostEstimate,
  CostItem,
} from '../../../shared/types/project';
import { AgentTeam } from './agent-factory';

/**
 * Cost Estimator Service (v0.7)
 * Generates detailed cost breakdown for infrastructure, services, and development
 */
export class CostEstimator {
  /**
   * Estimate complete project costs
   */
  estimateCosts(
    parsedData: ProjectSummary,
    researchResult: ResearchResult,
    agentTeam: AgentTeam,
    enrichment?: InputEnrichment
  ): CostEstimate {
    const items: CostItem[] = [];

    // Add all cost categories
    items.push(...this.estimateHosting(researchResult, enrichment));
    items.push(...this.estimateDatabase(researchResult, enrichment));
    items.push(...this.estimateStorage(parsedData, enrichment));
    items.push(...this.estimateBandwidth(enrichment));
    items.push(...this.estimateThirdParty(researchResult, parsedData));

    const totalMonthly = items.reduce((sum, item) => sum + item.monthlyEstimate, 0);
    const totalAnnual = totalMonthly * 12;

    // Determine confidence based on enrichment data
    const confidence = enrichment?.nfrScalability && enrichment?.budgetConstraint ? 'high' : enrichment ? 'medium' : 'low';

    return {
      items,
      totalMonthly,
      totalAnnual,
      confidence,
      notes: [
        'Estimates based on moderate usage patterns',
        'Free tiers utilized where applicable',
        'Costs scale with actual usage',
        'Enterprise plans may offer volume discounts',
      ],
      developmentCost: {
        totalHours: agentTeam.estimatedTotalHours,
        hourlyRateMin: 50,
        hourlyRateMax: 150,
        totalMin: agentTeam.estimatedTotalHours * 50,
        totalMax: agentTeam.estimatedTotalHours * 150,
      },
    };
  }

  private estimateHosting(research: ResearchResult, enrichment?: InputEnrichment): CostItem[] {
    const tier = enrichment?.scalabilityTier || 'small';
    const items: CostItem[] = [];

    // Frontend hosting
    if (tier === 'small') {
      items.push({
        service: 'Vercel (Frontend)',
        category: 'hosting',
        monthlyEstimate: 0,
        annualEstimate: 0,
        tier: 'Free',
        assumptions: ['100GB bandwidth/mo', '10K serverless function invocations', 'Unlimited static requests'],
        scalingNotes: 'Pro plan ($20/mo) adds 1TB bandwidth, 1M invocations',
      });
    } else if (tier === 'medium') {
      items.push({
        service: 'Vercel (Frontend)',
        category: 'hosting',
        monthlyEstimate: 20,
        annualEstimate: 240,
        tier: 'Pro',
        assumptions: ['1TB bandwidth/mo', '1M serverless invocations', 'Team features'],
        scalingNotes: 'Can handle 10K-50K monthly users',
      });
    } else {
      items.push({
        service: 'AWS CloudFront + S3 (Frontend)',
        category: 'hosting',
        monthlyEstimate: 50,
        annualEstimate: 600,
        tier: 'Pay-as-you-go',
        assumptions: ['100GB data transfer', '10M requests', 'CDN distribution'],
        scalingNotes: 'Scales linearly with usage',
      });
    }

    // Backend hosting
    if (tier === 'small') {
      items.push({
        service: 'Render/Railway (Backend)',
        category: 'hosting',
        monthlyEstimate: 7,
        annualEstimate: 84,
        tier: 'Starter',
        assumptions: ['512MB RAM', 'Sleep after inactivity', '100GB bandwidth'],
        scalingNotes: 'Standard plan ($21/mo) for always-on + 2GB RAM',
      });
    } else if (tier === 'medium') {
      items.push({
        service: 'DigitalOcean App Platform (Backend)',
        category: 'hosting',
        monthlyEstimate: 24,
        annualEstimate: 288,
        tier: 'Professional',
        assumptions: ['1GB RAM', 'Always-on', '500GB bandwidth'],
        scalingNotes: 'Can scale to 4GB RAM for $48/mo',
      });
    } else {
      items.push({
        service: 'AWS ECS Fargate (Backend)',
        category: 'hosting',
        monthlyEstimate: 45,
        annualEstimate: 540,
        tier: 'Pay-as-you-go',
        assumptions: ['0.5 vCPU', '1GB RAM', '24/7 uptime'],
        scalingNotes: 'Auto-scales based on demand',
      });
    }

    return items;
  }

  private estimateDatabase(research: ResearchResult, enrichment?: InputEnrichment): CostItem[] {
    const tier = enrichment?.scalabilityTier || 'small';
    const dbType = research.recommendedTechStack.database?.type || 'PostgreSQL';
    const items: CostItem[] = [];

    if (tier === 'small') {
      items.push({
        service: `Supabase/Neon (${dbType})`,
        category: 'database',
        monthlyEstimate: 0,
        annualEstimate: 0,
        tier: 'Free',
        assumptions: ['500MB storage', '2GB bandwidth', 'Pauseable compute'],
        scalingNotes: 'Pro plan ($25/mo) adds 8GB storage, 50GB bandwidth',
      });
    } else if (tier === 'medium') {
      items.push({
        service: `Supabase/Neon (${dbType})`,
        category: 'database',
        monthlyEstimate: 25,
        annualEstimate: 300,
        tier: 'Pro',
        assumptions: ['8GB storage', '50GB bandwidth', 'Always-on compute'],
        scalingNotes: 'Can handle 10K-50K rows',
      });
    } else {
      items.push({
        service: `AWS RDS (${dbType})`,
        category: 'database',
        monthlyEstimate: 75,
        annualEstimate: 900,
        tier: 'db.t3.small',
        assumptions: ['20GB SSD storage', 'Multi-AZ not included', 'Automated backups'],
        scalingNotes: 'Scale to db.t3.medium ($150/mo) for higher load',
      });
    }

    // Redis/Cache if real-time features
    const hasRealtime = research.requiredFeatures.some(f =>
      f.name.toLowerCase().includes('real-time') || f.name.toLowerCase().includes('websocket')
    );
    if (hasRealtime && tier !== 'small') {
      items.push({
        service: 'Upstash Redis (Cache)',
        category: 'database',
        monthlyEstimate: tier === 'medium' ? 10 : 30,
        annualEstimate: tier === 'medium' ? 120 : 360,
        tier: tier === 'medium' ? 'Standard' : 'Pro',
        assumptions: [`${tier === 'medium' ? '10K' : '100K'} commands/day`, 'Persistent storage'],
      });
    }

    return items;
  }

  private estimateStorage(parsedData: ProjectSummary, enrichment?: InputEnrichment): CostItem[] {
    const hasFileUpload = parsedData.features?.some(f =>
      f.toLowerCase().includes('upload') ||
      f.toLowerCase().includes('file') ||
      f.toLowerCase().includes('image') ||
      f.toLowerCase().includes('media')
    );

    if (!hasFileUpload) return [];

    const items: CostItem[] = [];
    const tier = enrichment?.scalabilityTier || 'small';

    if (tier === 'small') {
      items.push({
        service: 'Cloudinary (Image/Media)',
        category: 'storage',
        monthlyEstimate: 0,
        annualEstimate: 0,
        tier: 'Free',
        assumptions: ['25GB storage', '25GB bandwidth', 'Basic transformations'],
        scalingNotes: 'Plus plan ($99/mo) adds 200GB storage, advanced features',
      });
    } else {
      items.push({
        service: 'AWS S3 + CloudFront (Files)',
        category: 'storage',
        monthlyEstimate: tier === 'medium' ? 15 : 50,
        annualEstimate: tier === 'medium' ? 180 : 600,
        tier: 'Pay-as-you-go',
        assumptions: [`${tier === 'medium' ? '50GB' : '200GB'} storage`, 'CDN delivery'],
      });
    }

    return items;
  }

  private estimateBandwidth(enrichment?: InputEnrichment): CostItem[] {
    // Most hosting providers include bandwidth in base pricing
    // Only add if very high traffic expected
    if (enrichment?.scalabilityTier === 'enterprise') {
      return [{
        service: 'Additional Bandwidth',
        category: 'bandwidth',
        monthlyEstimate: 30,
        annualEstimate: 360,
        tier: 'Overage charges',
        assumptions: ['500GB additional beyond included limits'],
        scalingNotes: 'Scales with actual usage',
      }];
    }
    return [];
  }

  private estimateThirdParty(research: ResearchResult, parsedData: ProjectSummary): CostItem[] {
    const items: CostItem[] = [];
    const featureText = parsedData.features?.join(' ').toLowerCase() || '';

    // Email service
    if (featureText.includes('email') || featureText.includes('notification')) {
      items.push({
        service: 'SendGrid/Resend (Email)',
        category: 'third-party',
        monthlyEstimate: 0,
        annualEstimate: 0,
        tier: 'Free',
        assumptions: ['100 emails/day', 'Basic templates'],
        scalingNotes: 'Essentials plan ($20/mo) adds 50K emails/mo',
      });
    }

    // Payment processing
    if (featureText.includes('payment') || featureText.includes('checkout')) {
      items.push({
        service: 'Stripe (Payments)',
        category: 'third-party',
        monthlyEstimate: 50,
        annualEstimate: 600,
        tier: 'Pay-per-transaction',
        assumptions: ['$10K revenue/mo', '2.9% + $0.30 per transaction'],
        scalingNotes: 'Costs scale with transaction volume',
      });
    }

    // Analytics/Monitoring
    items.push({
      service: 'Vercel Analytics / Plausible',
      category: 'third-party',
      monthlyEstimate: 0,
      annualEstimate: 0,
      tier: 'Free/Included',
      assumptions: ['10K pageviews/mo', 'Basic analytics'],
      scalingNotes: 'Plausible ($9/mo) for 10K events, privacy-focused',
    });

    // Error tracking
    if (research.estimatedComplexity !== 'low') {
      items.push({
        service: 'Sentry (Error Tracking)',
        category: 'third-party',
        monthlyEstimate: 0,
        annualEstimate: 0,
        tier: 'Free',
        assumptions: ['5K errors/mo', 'Basic alerting'],
        scalingNotes: 'Team plan ($26/mo) adds 50K errors, advanced features',
      });
    }

    return items;
  }
}
