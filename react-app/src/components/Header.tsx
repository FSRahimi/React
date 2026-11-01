/*
  WHAT: Create a reusable website header.
  WHY: Keep header code separate from App.tsx.
  WHEN: When a section of UI should have its own component.
*/

// WHAT: Define the data that Header receives.
// WHY: TypeScript checks that title and subtitle are strings.
type HeaderProps = {
  title: string;
  subtitle: string;
};

// WHAT: Receive props from the parent component.
// WHY: The parent can customize the header text.
function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Display the library name */}
        <h1>📚 {title}</h1>

        {/* Display a short description */}
        <p>{subtitle}</p>
      </div>
    </header>
  );
}

// WHAT: Export the component.
// WHY: App.tsx must be able to import it.
export default Header;