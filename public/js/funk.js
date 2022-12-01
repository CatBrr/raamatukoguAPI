function show_hide(ram){
    const form = document.getElementById('editform'+ram);
    if (form.style.display === 'none') {
      // 👇️ this SHOWS the form
      form.style.display = 'block';
    } else {
      // 👇️ this HIDES the form
      form.style.display = 'none';
    }
}
