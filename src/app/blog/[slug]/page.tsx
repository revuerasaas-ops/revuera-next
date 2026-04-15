import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta/cta";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  content: string;
};

const POSTS: Record<string, BlogPost> = {
  "how-to-get-more-google-reviews": {
    slug: "how-to-get-more-google-reviews",
    title: "How to Get More Google Reviews in 2026",
    date: "March 2026",
    readTime: "6 min read",
    content: `
      <h2>Why Google Reviews Matter More Than Ever</h2>
      <p>In 2026, Google reviews are the single most influential factor in local business discovery. When someone searches "plumber near me" or "best cafe in Sydney," the businesses with more reviews and higher ratings consistently appear first. It's not just about visibility — it's about trust.</p>
      <p>Studies show that 93% of consumers read online reviews before making a purchase decision, and businesses with 4.5+ stars earn significantly more clicks than those below 4.0.</p>
      
      <h2>The Problem: Happy Customers Don't Leave Reviews</h2>
      <p>Here's the uncomfortable truth: unhappy customers are 2-3x more likely to leave a review than happy ones. This creates a negativity bias that drags down your rating over time — even if 95% of your customers are satisfied.</p>
      <p>The solution isn't to suppress negative reviews (that's both unethical and against Google's policies). The solution is to make it effortless for happy customers to leave positive reviews.</p>
      
      <h2>5 Proven Strategies</h2>
      <h3>1. Ask at the Right Moment</h3>
      <p>Timing is everything. The best moment to ask is right after a positive experience — when the customer is still feeling good about your service. For service businesses, this is immediately after the job is done. For ecommerce, it's 3-7 days after delivery.</p>
      
      <h3>2. Make It One Tap</h3>
      <p>Every extra step loses customers. Send a direct link that opens Google's review form — no searching, no navigating. Revuera generates this link automatically when you set up your account.</p>
      
      <h3>3. Use SMS, Not Email</h3>
      <p>SMS open rates are 98% vs 20% for email. When you text a customer, they see it within minutes. Revuera sends SMS review requests that customers can respond to with a single number.</p>
      
      <h3>4. Filter Before Google</h3>
      <p>This is the game-changer. Instead of sending every customer to Google, first ask them to rate their experience. Customers who rate 4-5 stars get directed to Google. Those who rate 1-3 stars are asked for private feedback instead. Your Google rating is protected.</p>
      
      <h3>5. Follow Up</h3>
      <p>Not everyone responds immediately. A gentle follow-up 24 hours later can increase your response rate by 40%. Revuera does this automatically.</p>
      
      <h2>The Bottom Line</h2>
      <p>Getting more Google reviews isn't about being pushy — it's about making it easy for happy customers to share their experience. With the right system, you can grow your review count consistently while protecting your rating from negativity bias.</p>
    `,
  },
  "google-review-automation": {
    slug: "google-review-automation",
    title: "Google Review Automation: Put Your Reputation on Autopilot",
    date: "February 2026",
    readTime: "5 min read",
    content: `
      <h2>What Is Review Automation?</h2>
      <p>Review automation is the practice of using software to systematically request, collect, and route customer reviews. Instead of manually asking each customer, the system handles it for you — sending review requests at the right time, filtering responses, and directing happy customers to your Google page.</p>
      
      <h2>How Smart Filtering Works</h2>
      <p>The core innovation in modern review automation is smart filtering. Here's how it works:</p>
      <p>After their experience with your business, each customer is asked to rate you from 1 to 5 stars. This happens via SMS or a web-based review funnel — not on Google.</p>
      <p>If they rate 4-5 stars, they're redirected to your Google review page where they can leave a public review. If they rate 1-3 stars, they're instead asked for private feedback that goes directly to your inbox.</p>
      <p>The result: your Google reviews are overwhelmingly positive (because only happy customers are directed there), while unhappy customers still have a voice (through private feedback that you can act on).</p>
      
      <h2>Is This Ethical?</h2>
      <p>Yes. You're not suppressing negative reviews or fake-reviewing. You're simply asking customers for feedback first, then directing them to the appropriate channel based on their experience. Customers who rate 1-3 stars aren't prevented from leaving a Google review — they're just not actively directed to do so.</p>
      
      <h2>For Ecommerce: The Review Funnel</h2>
      <p>For online stores, the review funnel works differently. After a purchase, customers land on a branded review page. They see your logo, tap a star rating, and are routed accordingly. This can be triggered automatically via a post-checkout redirect or a delayed webhook from your store platform.</p>
      <p>Revuera supports Shopify, WooCommerce, BigCommerce, Square, Stripe, and more — with per-platform webhook URLs and configurable delays.</p>
      
      <h2>Getting Started</h2>
      <p>The barrier to entry is lower than you think. Most review automation tools (including Revuera) require less than 5 minutes to set up. You connect your Google review link, start adding customers (or connect your store), and the system handles the rest.</p>
    `,
  },
  "negative-reviews-guide": {
    slug: "negative-reviews-guide",
    title: "The Business Owner's Guide to Handling Negative Reviews",
    date: "January 2026",
    readTime: "7 min read",
    content: `
      <h2>Negative Reviews Aren't the Enemy</h2>
      <p>Every business gets negative reviews. Even the best restaurant in your city has one-star reviews. The difference between businesses that thrive and those that suffer isn't the absence of negative reviews — it's how they handle them.</p>
      
      <h2>Prevention: The Best Medicine</h2>
      <p>The most effective strategy for handling negative reviews is preventing them from reaching Google in the first place. This doesn't mean silencing customers — it means giving them a better channel.</p>
      <p>When a customer has a bad experience, they want to be heard. If you give them a direct line to you (via private feedback), most will use that instead of going to Google. They get heard, you get a chance to fix it, and your Google rating stays protected.</p>
      
      <h2>When a Negative Review Does Appear</h2>
      <h3>1. Respond Quickly</h3>
      <p>Respond within 24 hours. A prompt response shows other potential customers that you care. Keep it professional, empathetic, and solution-oriented.</p>
      
      <h3>2. Acknowledge the Issue</h3>
      <p>Don't be defensive. Even if you disagree with the review, acknowledge that the customer had a negative experience. "We're sorry to hear about your experience" goes a long way.</p>
      
      <h3>3. Take It Offline</h3>
      <p>Invite the customer to contact you directly to resolve the issue. This shows good faith and prevents a public back-and-forth.</p>
      
      <h3>4. Learn and Improve</h3>
      <p>Treat negative reviews as free market research. If multiple customers mention the same issue, it's a signal to fix something in your business.</p>
      
      <h2>The Math of Reviews</h2>
      <p>Here's why volume matters: if you have 10 reviews and get 1 bad one, your rating drops significantly. If you have 100 reviews and get 1 bad one, it barely moves. The best defense against negative reviews is a large volume of positive ones.</p>
      <p>This is where automated review collection shines. By consistently requesting reviews from every customer, you build a buffer of positive reviews that absorbs the occasional negative one.</p>
      
      <h2>Smart Filtering: Your Safety Net</h2>
      <p>Tools like Revuera add another layer of protection. By filtering customers before they reach Google — sending happy ones to review and unhappy ones to private feedback — you ensure that the reviews that do reach Google are overwhelmingly positive.</p>
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // For static generation, we handle this synchronously via generateStaticParams
  return { title: "Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <div className="section-container max-w-3xl mx-auto">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-body-sm text-stone-500 hover:text-brand-600 transition-colors font-medium mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-display-md md:text-display-lg text-stone-900">{post.title}</h1>
            <div className="mt-4 flex items-center gap-4 text-body-sm text-stone-400">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
            </div>
          </div>

          {/* Content */}
          <div
            className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-12 prose prose-stone max-w-none
              [&_h2]:text-heading-lg [&_h2]:text-stone-900 [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-heading-md [&_h3]:text-stone-800 [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-body-md [&_p]:text-stone-600 [&_p]:leading-relaxed [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related posts */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h3 className="text-heading-md text-stone-900 mb-4">Related Articles</h3>
            <div className="grid gap-3">
              {Object.values(POSTS).filter((p) => p.slug !== slug).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block p-4 rounded-xl border border-stone-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all">
                  <span className="text-heading-sm text-stone-900 hover:text-brand-600 transition-colors">{p.title}</span>
                  <span className="block mt-1 text-caption text-stone-400">{p.date} · {p.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <CTA />
      <Footer />
    </>
  );
}
