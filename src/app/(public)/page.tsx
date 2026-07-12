import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturedMissions from "@/components/sections/FeaturedMissions";
import DisasterCategories from "@/components/sections/DisasterCategories";
import ImpactStats from "@/components/sections/ImpactStats";
import Partners from "@/components/sections/Partners";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
    return (
        <>
            <Hero />
            <HowItWorks />
            <FeaturedMissions />
            <DisasterCategories />
            <ImpactStats />
            <Partners />
            <Newsletter />
        </>
    );
}