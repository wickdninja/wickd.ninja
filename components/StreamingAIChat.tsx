import { useState } from "react";
import { Card } from "./ui/card";

interface IError {
  message: string;
}
interface UseCompletionProps {
  api: string;
  onError?: (error: any) => void;
}

const useCompletion = ({ api, onError }: UseCompletionProps) => {
  const [input, setInput] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IError | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      const data = await response.json();
      setCompletion(data.completion);
    } catch (err: any) {
      setError(err);
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    error,
  };
};

const StreamingAIChat = () => {
  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    error,
  } = useCompletion({
    api: "/api/chat",
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your message..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      {completion && (
        <Card className="p-4">
          <pre className="whitespace-pre-wrap">{completion}</pre>
        </Card>
      )}
      {error && (
        <Card className="p-4 bg-red-100 border-red-300">
          <pre className="whitespace-pre-wrap text-red-600">
            {error.message}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default StreamingAIChat;
