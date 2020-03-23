CKEDITOR.plugins.add('xiumi', {
  icons: 'xiumi',
  init: function(editor) {
    // Plugin logic goes here...
    editor.addCommand('xiumi', new CKEDITOR.dialogCommand('xiumiDialog'));
    editor.ui.addButton('xiumi', {
      label: '秀米',
      command: 'xiumi',
      toolbar: 'insert'
    })
    CKEDITOR.dialog.add('xiumiDialog', this.path + 'dialogs/xiumi.js')
  }
});
