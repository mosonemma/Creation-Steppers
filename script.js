<script>
  const menuButton = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');

  menuButton.addEventListener('click', () => {
    navList.classList.toggle('show');
  });
</script>
