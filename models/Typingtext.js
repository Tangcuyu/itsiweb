
var keystone = require('keystone');

/**
 * TypingText Model
 * ==================
 */

var TypingText = new keystone.List('TypingText', {
	label: '首页要显示的打印文本',
	singular: '要显示的字符串',
	plural: '要显示的字符串',
	map: { name: 'str' },
	autokey: { from: 'str', path: 'key', unique: true },
});

TypingText.add({
	str: { type: String, required: true , label:'要显示的字符串', default: '请输入要在页面上逐字打印显示的字符串'}
});

TypingText.register();
