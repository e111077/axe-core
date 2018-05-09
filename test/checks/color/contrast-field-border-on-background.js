describe('contrast-field-border-on-background', function () {
	'use strict'

	var fixture = document.getElementById('fixture');
	var checkContext = new axe.testUtils.MockCheckContext();
	var checkSetup = axe.testUtils.checkSetup;

	afterEach(function () {
		fixture.innerHTML = '';
		checkContext.reset();
		axe._tree = undefined;
	});

	describe('evaluate', function () {
		var evaluate = checks['contrast-field-border-on-background'].evaluate;

		it('throws if not an input or select or textarea', function () {
			assert.throws(function () {
				var params = checkSetup('<div contenteditable="true"></div>');
				evaluate.apply(checkContext, params);
			})
		});

		it('should pass when a background and border have sufficient contrast', function () {
			var params = checkSetup('<div style="background-color: #fff;"> <input id="target" type="text" style="border: 1px solid #000;"> </div>');
			assert.isTrue(evaluate.apply(checkContext, params));
		});

		it('should fail when the background and border have insufficient contrast', function () {
			var params = checkSetup('<div style="background-color: #fff;"> <input id="target" type="text" style="border: 1px solid #eee;"> </div>')
			assert.isFalse(evaluate.apply(checkContext, params));
		});

	})

});