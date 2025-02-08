import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { FaTwitter, FaNpm, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa"

export default function Biography() {
  return (
    <div className="relative z-20 max-w-4xl mx-auto px-4 py-20">
      <Card className="bg-gray-900/50 backdrop-blur border-cyan-500/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-8">
          <Avatar className="w-48 h-48">
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-GFtoq8ok7j6uxqCZDEFBs7nosgSkeD.png"
              alt="Nate Ross"
            />
            <AvatarFallback>NR</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Who am I?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              I'm Nate Ross, also known as wickdninja, a Staff Engineer at Bambee with a passion for building scalable
              applications and exploring the frontiers of AI technology. With over a decade of experience in full-stack
              development, I specialize in creating robust solutions using modern technologies like React, Node.js, and
              AWS.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              My approach combines technical expertise with a ninja-like precision, always seeking the most elegant and
              efficient solutions to complex problems. When I'm not coding, I'm constantly learning and exploring new
              technologies to stay at the cutting edge of software development.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <a
                href="https://twitter.com/wickdninja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.npmjs.com/~wickdninja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                <FaNpm size={24} />
              </a>
              <a
                href="https://github.com/wickdninja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/nate-ross-1593a477"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://wickd.ninja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                <FaGlobe size={24} />
              </a>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Want to see my digital business card? Run{" "}
              <code className="bg-gray-800 px-2 py-1 rounded">npx wickdninja</code> in your terminal!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

