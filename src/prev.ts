import { z } from "zod";
import ollama from "ollama";
import zodToJsonSchema from "zod-to-json-schema";
import { BlinkTools } from "./tools";
import { BlinkToolType } from "./types";
/* 
const model = "llama3.1:8b";
// const model = "deepseek-r1:1.5b";
async function findTool(query: string): Promise<string> {
  try {
    // Error handle what is there is no tool that matches the query
    const schema = z.object({
      tool: z.string().describe("The name of the tool to use."),
    });

    const tools = BlinkTools.map((t) => {
      return {
        name: t.name,
        description: t.description,
        synonyms: t.synonyms,
        example: t.example.map((q) => {
          return {
            query: q.query,
            tool: t.name,
          };
        }),
      };
    });

    const llm = await ollama.chat({
      model,
      messages: [
        {
          role: "user",
          content: `You are an intelligent assistant tasked with identifying the most suitable tool 
                to address user queries effectively. 

                User Query: "${query}" 

                Available Tools: ${JSON.stringify(tools)} 

                Please analyze the user query and recommend the best tool from the list 
                based on its relevance and functionality. Consider the tool descriptions 
                and synonyms to ensure an accurate match.`,
        },
      ],
      format: zodToJsonSchema(schema),
    });

    return JSON.parse(llm.message.content).tool;
  } catch (err) {
    console.log(err);
    throw new Error("Error finding tool");
  }
}

async function getInputs(query: string, tool: BlinkToolType) {
  try {
    const llm = await ollama.chat({
      model,
      messages: [
        {
          role: "user",
          content: `Extract the required information from the given query based on the schema and examples provided.
          Ensure the output strictly matches the schema. ${tool.customToolPrompt}
          ### Examples:
          ${JSON.stringify(tool.example, null, 2)}

          ### Query:
          ${query}

          ### Output Format:
          Return an object strictly matching the schema.`,
        },
      ],
      format: zodToJsonSchema(tool.schema),
    });
    return JSON.parse(llm.message.content);
  } catch (err) {
    console.log(err);
    throw new Error("Error getting inputs");
  }
}

export async function main(
  query: string,
): Promise<{ status: string; url: string }> {
  const toolName = await findTool(query);
  const tool = BlinkTools.find((t) => t.name === toolName);

  const input = await getInputs(query, tool!);

  const url = await tool?.function(input);
  console.log(url);
  return url;
}

main("Swap USDC to SOl");
*/
