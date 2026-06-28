import { SendIcon } from "lucide-react";
import { useState } from "react";
import { ModelSelector } from "@/components/model-selector/model-selector";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupToolbar,
} from "./components/ui/input-group";

function App() {
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <InputGroup className="bg-input-background">
          <InputGroupTextarea
            className="min-h-[100px] placeholder:font-medium"
            placeholder="What do you want to do?"
          />
          <InputGroupToolbar align="block-end">
            <ModelSelector
              onValueChange={(modelId) => {
                setSelectedModelId(modelId);
              }}
              value={selectedModelId}
            />
            <InputGroupButton className="ml-auto" size="sm" variant="default">
              <SendIcon />
              Send
            </InputGroupButton>
          </InputGroupToolbar>
        </InputGroup>
      </div>
    </main>
  );
}

export default App;
