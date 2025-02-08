"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FaTwitter,
  FaNpm,
  FaGithub,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BackNav } from "@/components/BackNav";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const socialLinks = [
  {
    name: "Twitter",
    url: "https://twitter.com/wickdninja",
    icon: FaTwitter,
  },
  {
    name: "NPM",
    url: "https://www.npmjs.com/~wickdninja",
    icon: FaNpm,
  },
  {
    name: "GitHub",
    url: "https://github.com/wickdninja",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/nate-ross-1593a477",
    icon: FaLinkedin,
  },
  {
    name: "Website",
    url: "https://wickd.ninja",
    icon: FaGlobe,
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // In a real application, you would send this to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
              <CardTitle className="text-3xl text-cyan-400">
                Get in Touch
              </CardTitle>
              <CardDescription className="text-gray-300">
                Have a question or want to work together? Drop me a message!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="bg-gray-700 border-gray-600 text-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              className="bg-gray-700 border-gray-600 text-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's this about?"
                              className="bg-gray-700 border-gray-600 text-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your message..."
                              className="bg-gray-700 border-gray-600 text-gray-200 min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">
                      Connect with me
                    </h3>
                    <div className="flex flex-wrap gap-4">
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
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">
                      Quick Contact
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>Email: contact@wickd.ninja</p>
                      <p>Location: Remote</p>
                      <p className="text-sm text-gray-400 mt-4">
                        Prefer CLI? Try running:
                        <code className="block mt-2 p-2 bg-gray-700 rounded">
                          npx wickdninja
                        </code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
