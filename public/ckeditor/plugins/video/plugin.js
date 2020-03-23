CKEDITOR.plugins.add('video', {
  icons: 'video',
  init: function (editor) {
    // Plugin logic goes here...
    editor.addCommand('video', new CKEDITOR.dialogCommand('videoDialog'));
    editor.ui.addButton('video', {
      label: '插入视频',
      command: 'video',
      toolbar: 'insert'
    })
    CKEDITOR.dialog.add('videoDialog', this.path + 'dialogs/video.js?20190909')
  }
});
