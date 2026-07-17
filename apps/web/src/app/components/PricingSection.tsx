"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function PricingSection({ initialPlans }: { initialPlans?: any[] }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const defaultPlans = [
    {
      id: "starter",
      name: "Starter",
      priceDisplay: "₹0",
      period: "/ month",
      text: "For trying the builder",
      items: [
        "Free Forever",
        "1 Website (Download Only)",
        "1,000 AI Credits/month",
        "No hosting included"
      ],
      featured: false,
      buttonText: "Choose Free",
      signUpUrl: "/signup?plan=starter"
    },
    {
      id: "individual",
      name: "Individual Plan",
      priceDisplay: billingCycle === "monthly" ? "₹199" : "₹2,269",
      period: billingCycle === "monthly" ? "/ month" : "/ year",
      text: "For personal use",
      items: [
        "3 Published Subdomains",
        "Custom domain support",
        "2,000 AI Credits/month"
      ],
      featured: false,
      buttonText: "Choose Individual",
      signUpUrl: billingCycle === "monthly" ? "/signup?plan=individual" : "/signup?plan=individual-annual",
      discountBadge: billingCycle === "annually" ? "Save 5%" : null,
      subText: billingCycle === "annually" ? "Equivalent to ₹189/month" : null
    },
    {
      id: "pro-plan",
      name: "Pro Plan",
      priceDisplay: billingCycle === "monthly" ? "₹799" : "₹8,629",
      period: billingCycle === "monthly" ? "/ month" : "/ year",
      text: "For creators and teams",
      items: [
        "15 Published Websites",
        "Custom Domain Support",
        "Create ecommerce sites",
        "Logins for each site",
        "Priority support",
        "10,000 AI Credits/month"
      ],
      featured: true,
      buttonText: "Choose Pro",
      signUpUrl: billingCycle === "monthly" ? "/signup?plan=pro-plan" : "/signup?plan=pro-plan-annual",
      discountBadge: billingCycle === "annually" ? "Save 10%" : null,
      subText: billingCycle === "annually" ? "Equivalent to ₹719/month" : null
    },
    {
      id: "agency",
      name: "Agency Plan",
      priceDisplay: billingCycle === "monthly" ? "₹2,999" : "₹30,590",
      period: billingCycle === "monthly" ? "/ month" : "/ year",
      text: "For client production",
      items: [
        "Unlimited Websites",
        "Custom domain support",
        "Create ecommerce sites",
        "Logins for each site",
        "Bring your own Key option",
        "Priority support",
        "White Label Support",
        "50,000 AI Credits/month"
      ],
      featured: false,
      buttonText: "Choose Agency",
      signUpUrl: billingCycle === "monthly" ? "/signup?plan=agency" : "/signup?plan=agency-annual",
      discountBadge: billingCycle === "annually" ? "Save 15%" : null,
      subText: billingCycle === "annually" ? "Equivalent to ₹2,549/month" : null
    }
  ];

  let plans = defaultPlans;

  if (initialPlans && initialPlans.length > 0) {
    plans = initialPlans.map((plan) => {
      const defaultInfo = defaultPlans.find(p => 
        p.id === plan.id || 
        p.name.toLowerCase() === plan.name.toLowerCase() ||
        (plan.name.toLowerCase().includes("starter") && p.id === "starter") ||
        (plan.name.toLowerCase().includes("individual") && p.id === "individual") ||
        (plan.name.toLowerCase().includes("pro") && p.id === "pro-plan") ||
        (plan.name.toLowerCase().includes("agency") && p.id === "agency")
      ) || {
        text: "Custom plan details",
        featured: false,
        buttonText: "Choose Plan",
        signUpUrl: `/signup?plan=${plan.id}`
      };

      const monthlyPrice = plan.price;
      const discountPercent = plan.yearlyDiscount || 0;
      let annualPrice = plan.price * 12;
      let discountBadge = null;
      let subText = null;

      if (discountPercent > 0) {
        annualPrice = Math.round(plan.price * 12 * (1 - discountPercent / 100));
        discountBadge = `Save ${discountPercent}%`;
        subText = `Equivalent to ₹${Math.round(annualPrice / 12)}/month`;
      }

      const priceDisplay = plan.price === 0 
        ? "₹0" 
        : (billingCycle === "monthly" ? `₹${monthlyPrice}` : `₹${annualPrice.toLocaleString("en-IN")}`);

      const signUpUrl = plan.price === 0 
        ? `/signup?plan=${plan.id}`
        : (billingCycle === "monthly" ? `/signup?plan=${plan.id}` : `/signup?plan=${plan.id}-annual`);

      // Clean and enrich plan items
      let planItems: string[] = plan.features.split(",").map((item: string) => item.trim());
      
      const isStarter = plan.id === "starter" || plan.name.toLowerCase().includes("starter") || plan.price === 0;
      if (isStarter) {
        // Remove 30 Days Duration and 1 Subdomain
        planItems = planItems.filter(item => 
          !item.toLowerCase().includes("day") && 
          !item.toLowerCase().includes("duration") &&
          !item.toLowerCase().includes("subdomain")
        );
        // Ensure "Free Forever" is at the top
        if (!planItems.some(item => item.toLowerCase().includes("free forever") || item.toLowerCase().includes("forever"))) {
          planItems.unshift("Free Forever");
        }
        // Ensure "1 Website (Download Only)" is listed
        if (!planItems.some(item => item.toLowerCase().includes("download only") || item.toLowerCase().includes("1 website"))) {
          planItems.push("1 Website (Download Only)");
        }
        // Ensure "No hosting included" is listed
        if (!planItems.some(item => item.toLowerCase().includes("no hosting"))) {
          planItems.push("No hosting included");
        }
      }

      // Filter out any existing credit entries from the features string
      planItems = planItems.filter(item => !item.toLowerCase().includes("credits") && !item.toLowerCase().includes("credit"));
      
      // Append the clean, formatted credit limit from database plan
      const creditsDisplay = plan.creditsLimit ? plan.creditsLimit.toLocaleString("en-IN") : "0";
      planItems.push(isStarter ? `${creditsDisplay} Free Credits` : `${creditsDisplay} Credits/month`);

      return {
        id: plan.id,
        name: plan.name,
        priceDisplay,
        period: plan.price === 0 ? "/ month" : (billingCycle === "monthly" ? "/ month" : "/ year"),
        text: defaultInfo.text,
        items: planItems,
        featured: defaultInfo.featured,
        buttonText: defaultInfo.buttonText,
        signUpUrl,
        discountBadge: billingCycle === "annually" ? discountBadge : null,
        subText: billingCycle === "annually" ? subText : null
      };
    });
  }

  const maxDiscount = plans.reduce((max, p) => {
    const discount = p.discountBadge ? parseInt(p.discountBadge.replace(/[^0-9]/g, ""), 10) : 0;
    return discount > max ? discount : max;
  }, 0);

  return (
    <section id="pricing" className="section-band">
      <div className="section-copy" style={{ textAlign: "center", margin: "0 auto 2.5rem auto", maxWidth: "600px" }}>
        <span className="eyebrow">Pricing</span>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Plans that scan clearly.</h2>
        <p>Simple tiers, clearer spacing, and calls to action that do not stack awkwardly down the page.</p>
 
        {/* Billing Cycle Switcher */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", marginTop: "2rem", background: "rgba(255,255,255,0.03)", padding: "0.4rem 1rem", borderRadius: "2rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            style={{
              background: billingCycle === "monthly" ? "linear-gradient(135deg, #4f7cff, #20c7b5)" : "transparent",
              border: "none",
              color: "#fff",
              padding: "0.4rem 1.2rem",
              borderRadius: "1.5rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annually")}
            style={{
              background: billingCycle === "annually" ? "linear-gradient(135deg, #4f7cff, #20c7b5)" : "transparent",
              border: "none",
              color: "#fff",
              padding: "0.4rem 1.2rem",
              borderRadius: "1.5rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            Annually
            {maxDiscount > 0 && (
              <span style={{ fontSize: "0.7rem", background: "rgba(61, 220, 151, 0.2)", color: "#3ddc97", padding: "0.1rem 0.4rem", borderRadius: "10px", fontWeight: 800 }}>
                Up to {maxDiscount}% off
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow">{plan.name}</span>
                {plan.discountBadge && (
                  <span style={{ fontSize: "0.7rem", background: "rgba(61, 220, 151, 0.15)", color: "#3ddc97", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontWeight: 700 }}>
                    {plan.discountBadge}
                  </span>
                )}
              </div>
              <span className="price" style={{ margin: "1rem 0 0.5rem 0" }}>
                {plan.priceDisplay}
                <small style={{ fontSize: "1rem", color: "#9aa7bd", fontWeight: 400 }}>{plan.period}</small>
              </span>
              {plan.subText && (
                <span style={{ display: "block", fontSize: "0.8rem", color: "#3ddc97", marginBottom: "1rem", fontWeight: 600 }}>
                  {plan.subText}
                </span>
              )}
              <p style={{ marginBottom: "1.5rem" }}>{plan.text}</p>
              <ul style={{ minHeight: "12rem" }}>
                {plan.items.map((item) => (
                  <li key={item}><CheckCircle2 size={17} color="#3ddc97" /> {item}</li>
                ))}
              </ul>
            </div>
            <a className={plan.featured ? "primary-action" : "secondary-action"} href={plan.signUpUrl} style={{ width: "100%", justifyContent: "center" }}>
              {plan.buttonText}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
