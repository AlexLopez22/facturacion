import { AppRoutes } from "./rutas/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Sistema de Facturación Electrónica
      </h1>
      <AppRoutes />
    </div>
  );
}

export default App;
