import "./App.css";
import { Button } from "./components/ui/button";

function App() {
    return (
        <>
            <Button
                onClick={() => {
                    window.alert("AUTOCODERZ");
                }}
            >
                test button
            </Button>
            <div className="border-4 p-16 border-green-500">Test</div>
        </>
    );
}

export default App;
