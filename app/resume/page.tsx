"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "react-spring"
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa"

const experiences = [
  {
    company: "Bambee",
    logo: "/bambee-logo.png", // You'll need to add this logo to your public folder
    roles: [
      {
        title: "Staff Engineer",
        period: "Nov 2024 - Present",
        location: "Remote",
        description:
          "Spearheading technical transformation with agentic AI solutions powered by OpenAI. Leading development with AWS, EKS, Terraform, and NodeJS.",
        skills: ["Node.js", "OpenAI", "Agentic AI", "Terraform", "AWS", "Kubernetes"],
      },
      {
        title: "Sr. Software Engineer, Fullstack",
        period: "Jul 2022 - Nov 2024",
        location: "Remote",
        description:
          "Crafted scalable applications using AWS, Okta, and ApolloGraphQL. Worked with EKS, NestJS, Vue, Redis, and Postgres.",
        skills: ["Vue", "NestJS", "AWS", "GraphQL", "Redis", "PostgreSQL"],
      },
    ],
  },
  {
    company: "Allied Payment Network",
    logo: "/allied-logo.png", // You'll need to add this logo to your public folder
    roles: [
      {
        title: "Senior Developer",
        period: "Feb 2018 - Jul 2022",
        location: "Fort Wayne, Indiana Area",
        description:
          "Designed & implemented distributed systems for financial solutions using .Net, React, Docker, and AWS.",
        skills: ["React", ".NET", "AWS", "Docker", "Kubernetes", "DynamoDB"],
      },
      {
        title: "Associate Developer",
        period: "Jun 2014 - Feb 2018",
        location: "Fort Wayne, Indiana",
        description: "Developed features and fixed bugs using ASP.NET MVC 4, C#, JavaScript, and AngularJS.",
        skills: ["ASP.NET", "C#", "JavaScript", "AngularJS"],
      },
    ],
  },
  {
    company: "JetPro Pilots, LLC",
    logo: "/jetpro-logo.png", // You'll need to add this logo to your public folder
    roles: [
      {
        title: "Full Stack Engineer",
        period: "Dec 2014 - Jul 2022",
        location: "Fort Wayne, Indiana",
        description: "Built cross-platform mobile expense tracking solution using MongoDB, NodeJS, and React.",
        skills: ["MongoDB", "Node.js", "React", "Express", "Heroku"],
      },
    ],
  },
  {
    company: "Valbruna Stainless Inc",
    logo: "/valbruna-logo.png", // You'll need to add this logo to your public folder
    roles: [
      {
        title: "Web Developer/DBA",
        period: "Jan 2013 - Jun 2014",
        location: "Fort Wayne, Indiana",
        description:
          "Developed and maintained websites and applications using various technologies including ASP.NET MVC4 and SQL.",
        skills: ["ASP.NET", "SQL", "JavaScript", "jQuery", "PHP"],
      },
    ],
  },
]

const ExperienceCard = ({ experience, isEven }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const props = useSpring({
    opacity: isExpanded ? 1 : 0,
    maxHeight: isExpanded ? 1000 : 0,
    config: { tension: 300, friction: 20 },
  })

  return (
    <motion.div
      className={`flex items-center mb-10 ${isEven ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-shrink-0 w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center">
        <img
          src={experience.logo || "/placeholder.svg"}
          alt={`${experience.company} logo`}
          className="w-24 h-24 object-contain"
        />
      </div>
      <div className={`flex-grow ${isEven ? "mr-8 text-right" : "ml-8"}`}>
        <h3 className="text-2xl font-bold text-cyan-400">{experience.company}</h3>
        {experience.roles.map((role, index) => (
          <div key={index} className="mt-4">
            <h4 className="text-xl font-semibold text-gray-300">{role.title}</h4>
            <p className="text-gray-400 flex items-center mt-1">
              <FaCalendar className="mr-2" /> {role.period}
            </p>
            <p className="text-gray-400 flex items-center mt-1">
              <FaMapMarkerAlt className="mr-2" /> {role.location}
            </p>
            <button
              className="text-cyan-400 hover:text-cyan-300 mt-2 focus:outline-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
            <animated.div style={props}>
              <p className="text-gray-300 mt-2">{role.description}</p>
              <div className="flex flex-wrap mt-2">
                {role.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="bg-gray-700 text-cyan-400 px-2 py-1 rounded mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            </animated.div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-cyan-400 mb-10">Professional Experience</h1>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-cyan-400"></div>
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} isEven={index % 2 === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}

