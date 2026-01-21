import { BrowserRouter } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">
                            University Portal
                        </h1>
                        <p className="text-muted-foreground">
                             Setup Complete ✓
                        </p>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
