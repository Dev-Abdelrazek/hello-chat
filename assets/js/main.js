// Toggle dropdown menu
$(() => {
  $("#action_menu_btn").on("click", function () {
    $(".action_menu").toggle();
  });
});

// Close alert
$(".close").on("click", function () {
  $(this).parent(".custom-alert").hide();
});
