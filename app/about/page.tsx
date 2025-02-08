"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FaTwitter,
  FaNpm,
  FaGithub,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import { BackNav } from "@/components/BackNav";

const skills = [
  "React",
  "Node.js",
  "TypeScript",
  "Next.js",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Terraform",
  "CI/CD",
  "Microservices",
  "Serverless",
  "React Native",
  "Vue.js",
  "Express",
  ".NET",
  "Azure",
  "Agile Methodologies",
];

const timeline = [
  {
    year: "2024",
    title: "Staff Engineer at Bambee",
    description: "Leading technical transformation with agentic AI solutions.",
  },
  {
    year: "2022",
    title: "Senior Software Engineer at Bambee",
    description:
      "Crafted scalable applications using AWS, Okta, and ApolloGraphQL.",
  },
  {
    year: "2018",
    title: "Senior Developer at Allied Payment Network",
    description:
      "Designed & implemented distributed systems for financial solutions.",
  },
  {
    year: "2014",
    title: "Full Stack Engineer at JetPro Pilots, LLC",
    description: "Built cross-platform mobile expense tracking solution.",
  },
  {
    year: "2013",
    title: "Web Developer/DBA at Valbruna Stainless Inc",
    description: "Developed and maintained websites and applications.",
  },
];

const socialLinks = [
  { name: "Twitter", url: "https://twitter.com/wickdninja", icon: FaTwitter },
  { name: "NPM", url: "https://www.npmjs.com/~wickdninja", icon: FaNpm },
  { name: "GitHub", url: "https://github.com/wickdninja", icon: FaGithub },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/nate-ross-1593a477",
    icon: FaLinkedin,
  },
  { name: "Website", url: "https://wickd.ninja", icon: FaGlobe },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-GFtoq8ok7j6uxqCZDEFBs7nosgSkeD.png"
                    alt="Nate Ross"
                  />
                  <AvatarFallback>NR</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl text-cyan-400">
                    Nate Ross
                  </CardTitle>
                  <p className="text-gray-300">
                    Staff Engineer @ Bambee | wickdninja
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  About Me
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  I'm a passionate Staff Engineer with over a decade of
                  experience in full-stack development. My journey in tech has
                  been driven by a relentless curiosity and a desire to create
                  innovative solutions that make a real impact. From crafting
                  scalable applications to leading technical transformations,
                  I've always approached challenges with a ninja-like precision,
                  seeking the most elegant and efficient solutions.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Currently, I'm spearheading the technical transformation at
                  Bambee, where I'm leveraging agentic AI solutions to deliver
                  instantaneous value for our customers. My expertise spans
                  across modern web technologies, cloud platforms, and DevOps
                  practices, allowing me to architect and implement robust,
                  scalable systems.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-gray-700 text-cyan-400"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  Career Timeline
                </h2>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex"
                    >
                      <div className="mr-4 text-cyan-400 font-bold">
                        {item.year}
                      </div>
                      <div>
                        <h3 className="text-gray-200 font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  Philosophy
                </h2>
                <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-300">
                  "In the world of code, be like a ninja: swift, precise, and
                  always learning. Embrace challenges as opportunities to
                  sharpen your skills and leave a trail of elegant solutions in
                  your wake."
                </blockquote>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  Connect with me
                </h2>
                <div className="flex space-x-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      aria-label={`Visit my ${link.name} profile`}
                    >
                      <link.icon size={24} />
                    </motion.a>
                  ))}
                </div>
              </section>

              <section className="text-center">
                <p className="text-gray-400 text-sm">
                  Want to see my digital business card? Run{" "}
                  <code className="bg-gray-700 px-2 py-1 rounded text-cyan-400">
                    npx wickdninja
                  </code>{" "}
                  in your terminal!
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
