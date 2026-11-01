/*
  WHAT: Create the website footer.
  WHY: Keep repeated layout sections separate.
  WHEN: When building websites with multiple sections.
*/

function Footer() {
  // WHAT: Calculate the current year.
  // WHY: Avoid manually changing the year in the footer.
  // WHEN: When the displayed year should stay current.
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {currentYear} Kabul Community Library.
        All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;