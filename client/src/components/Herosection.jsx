import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero1 = ({
    badge = "✨ Your Product Tracker",
    heading = "Track Your Product and Grow With TrackSure",
    description = "TrackSure is product tracking system designed to streamline your inventory management. With real-time analytics, you can optimize your supply chain and make data-driven decisions.",
    buttons = {
        secondary: {
            text: "Contact Us",
            url: "#contact",
        },
        primary: {
            text: "Get Started Today",
            url: "/signup",
        },
    },
    image = {
        src: "/dashboardscreen.png",
        alt: "Hero section demo image showing interface components",
    },
}) => {
    return (
        <section className="py-22">
            <div className="container">
                <div className="flex items-center gap-8">
                    {/* Content Section */}
                    <div className="flex w-[60%] flex-col items-center text-center lg:items-start lg:text-left">
                        {badge && (
                            <Badge variant="outline" className="flex items-center gap-2">
                                {badge}
                                <ArrowUpRight className="size-4" />
                            </Badge>
                        )}
                        <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
                            {heading}
                        </h1>
                        <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                            {description}
                        </p>

                        {/* Buttons */}
                        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                            {buttons.primary && (
                                <Button asChild className="w-full sm:w-auto">
                                    <Link to={buttons.primary.url}>
                                        {buttons.primary.text}
                                    </Link>
                                </Button>
                            )}
                            {buttons.secondary && (
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <Link to={buttons.secondary.url} className="flex items-center gap-2">
                                        {buttons.secondary.text}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="w-[40%]"><img src="/headingsvg.svg" className="w-full "/></div>
                </div>
            </div>
        </section>
    );
};

export { Hero1 };
