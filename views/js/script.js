// login form to registration form transition function

$(".prompt a").click(function() {
  $("form").animate({ height: "toggle" }, "slow");
});
