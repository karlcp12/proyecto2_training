import Button from "./components/atoms/Button";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Probando mi Button Átomo</h1>

      <Button>Primary</Button>
      <br /><br />

      <Button variant="secondary">Secondary</Button>
      <br /><br />

      <Button variant="outline">Outline</Button>
      <br /><br />

      <Button size="lg">Large Button</Button>
      <br /><br />

      <Button loading>Guardando</Button>
      <br /><br />

      <Button disabled>Deshabilitado</Button>
    </div>
  );
}

export default App;