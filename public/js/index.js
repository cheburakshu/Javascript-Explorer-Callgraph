$(document).on('click', '.browse', function(){
  var file = $(this).parent().parent().parent().find('.file');
  file.trigger('click');
});
$(document).on('change', '.file', function(){
  var filename=$(this).val().replace(/C:\\fakepath\\/i, '');
  $(this).parent().find('.form-control').val(filename);
  if (filename){
    $('#uploadFile').submit();
  }
});

$(document).ready(function(){

    $('form').submit(function(e){
      e.stopPropagation();
      e.preventDefault();
      var fd = new FormData();
      fd.append('file', $('#file')[0].files[0]);
      $.ajax({
        url: '/upload',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
          callGraph(data);
        }
      });
    });

});
