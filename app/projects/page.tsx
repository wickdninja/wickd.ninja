"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Youtube } from "lucide-react";
import Image from "next/image";
import { BackNav } from "@/components/BackNav";

const projects = [
  {
    title: "KidMath.ai",
    description: "An AI-powered math learning platform for children",
    period: "2024 - Present",
    link: "https://kidmath.ai",
    images: [], // TODO: Add screenshots once provided
    technologies: ["Next.js", "OpenAI", "TypeScript", "Tailwind CSS"],
    role: "Lead Developer",
  },
  {
    title: "JJ Roofing & Remodel",
    description: "A modern website for a roofing and remodeling company",
    period: "2023",
    link: "https://jjroofingandremodel.com",
    images: [], // TODO: Add screenshots once provided
    technologies: ["React", "Next.js", "Tailwind CSS"],
    role: "Full Stack Developer",
  },
  {
    title: "Rise'n Roll Mobile Ordering",
    description:
      "A comprehensive mobile ordering solution for Rise'n Roll Bakery",
    period: "2022",
    link: "https://apps.apple.com/us/app/risen-roll-valparaiso/id1522338728?platform=iphone",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/item-rMbLrN0eqMI78B2YXoeAMQNyIoMizt.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home%202-yOVSWZYKXpcnNIdxOfa0aCmX9wSNQ8.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza-H5z5fWAI96LKx8lR4ljbW1E1yhoPey.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/menu%202-jQnY4kD3EtUwagWi7HawjUoFFfIy5g.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/menu-Bhgkf8fVJFg3zKXeEmNFYzrwRRUkbH.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-WNCrvDf5KBOZNsxPDolCDjy1Z9rqRH.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ipad-9A9qKPhkDKxMb1x1NhOZRvJ3ZEFZad.webp",
    ],
    technologies: ["React Native", "Node.js", "Express", "MongoDB"],
    role: "Lead Mobile Developer",
    features: [
      "Mobile ordering system",
      "Rewards program",
      "Menu customization",
      "Real-time order tracking",
      "Multiple location support",
    ],
  },
  {
    title: "Allied Payment Solutions",
    description:
      "Enterprise financial technology solutions for banks and credit unions",
    period: "2018 - 2022",
    link: "https://alliedpayment.com",
    videos: [
      "https://youtu.be/Z75oTGUrD5o",
      "https://youtu.be/srWUWEHGlv0",
      "https://youtu.be/EmvPFr_5jzE",
      "https://youtu.be/Sgra_0794VQ",
    ],
    technologies: ["React", ".NET", "AWS", "Docker", "Kubernetes"],
    role: "Senior Developer",
    features: [
      "Picture pay technology",
      "Real-time payment processing",
      "Bank integration systems",
      "Customer portal",
    ],
  },
  {
    title: "Allied SSO Portal",
    description:
      "Single Sign-On solution for Allied Payment's enterprise applications",
    period: "2020 - 2022",
    link: "https://sso.alliedpayment.com",
    images: [], // TODO: Add screenshots once provided
    technologies: ["React", "OAuth 2.0", "OpenID Connect", "AWS Cognito"],
    role: "Lead Developer",
    features: [
      "Single Sign-On",
      "Multi-factor authentication",
      "Role-based access control",
      "User management",
    ],
  },
];

const ProjectCard = ({ project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (project.images?.length || 0) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (project.images?.length || 0) - 1 : prev - 1
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {project.images?.[0] && (
                <div className="relative h-48 bg-gray-900">
                  <Image
                    src={project.images[0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">{project.period}</p>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {(project.images?.length > 0 || project.videos?.length > 0) && (
              <TabsTrigger value="media">Media</TabsTrigger>
            )}
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {project.title}
            </h2>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400">
                <span className="font-semibold">Role:</span> {project.role}
              </p>
              <Button asChild variant="outline">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Visit Project <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="media" className="mt-4">
            {project.images?.length > 0 && (
              <div className="relative">
                <div className="relative h-[500px] bg-gray-900 rounded-lg overflow-hidden">
                  <Image
                    src={
                      project.images[currentImageIndex] || "/placeholder.svg"
                    }
                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                  {project.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-center text-gray-400 mt-2">
                  Image {currentImageIndex + 1} of {project.images.length}
                </p>
              </div>
            )}
            {project.videos?.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {project.videos.map((video, index) => (
                  <a
                    key={index}
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Youtube className="text-red-500" />
                    <span className="text-gray-300">
                      Watch Video {index + 1}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="features" className="mt-4">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Key Features
            </h3>
            <ul className="space-y-2">
              {project.features?.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          Projects
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
