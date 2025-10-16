import { Button } from "@/components/ui/button";

function App() {
    return (
        <>
            <h1>My app</h1>
            <div className="flex min-h-svh flex-col items-center justify-center">
                <Button onClick={() => window.alert("hello world!")}>
                    Click me
                </Button>
            </div>
        </>
    );
}

export default App;
