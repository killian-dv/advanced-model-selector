import { InputGroup, InputGroupTextarea } from "./components/ui/input-group";

function App() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <InputGroup className="bg-input-background">
          <InputGroupTextarea
            className="min-h-[100px] placeholder:font-medium"
            placeholder="What do you want to do?"
          />
        </InputGroup>
      </div>
    </main>
  );
}

export default App;
