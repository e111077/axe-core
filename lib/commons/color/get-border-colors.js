/* global axe, color */

/**
 * Returns an object containing border color of the given node along the positions `top`, `right`, `bottom`, `left`, or null if can't be determined.
 * @method getBorderColors
 * @memberof axe.commons.color
 * @instance
 * @param {Element} node
 * @return { { 'top': '#000', 'bottom': '#555' } |null}
 */
color.getBorderColors = function (node) {

	const CONSTANTS = {
		BORDER_DIRECTIONS: ['top', 'right', 'bottom', 'left'],
		ALLOWED_BORDER_WIDTH_VALUES: ['thin', 'medium', 'thick', 'inherit', 'initial', 'unset'],
		BORDER_WIDTH_PREFIXES: ['px', 'rem', 'cm', 'em'],
		NOT_ALLOWED_BORDER_STYLE: 'none',
		NOT_ALLOWED_BORDER_WIDTH: '0',
	};

	function hasBorderImage(ns) {
		return ns && ns.getPropertyValue('border-image');
	}

	// check existence for `border-style` - is not none or border width 0
	function hasValidBorderStyle(ns, property) {
		const borderStyle = ns.getPropertyValue(property);
		return borderStyle && borderStyle !== CONSTANTS.NOT_ALLOWED_BORDER_STYLE;
	}

	// check existence for `border-width` - ensure this is not 0 or none.
	function hasValidBorderWidth(ns, property) {
		const borderWidth = ns.getPropertyValue(property);
		const containedPrefix = CONSTANTS.BORDER_WIDTH_PREFIXES.filter((prefix) => {
			if (borderWidth.search(prefix) >= 0) {
				return prefix;
			}
		})[0];
		return containedPrefix && (borderWidth.replace(containedPrefix, '') !== CONSTANTS.NOT_ALLOWED_BORDER_WIDTH);
	}

	function getBorderColor(ns, property) {
		let c = new color.Color();
		c.parseRgbString(ns.getPropertyValue(property));
		return c;
	}

	function hasValidBorderColorAlpha(c) {
		return (c.alpha > (1 / 100));
	}

	function getBorderColorIfValid(ns, edge) {
		let out = {
			valid: false,
			color: null
		};
		if (hasValidBorderStyle(ns, `border-${edge}-style`) && hasValidBorderWidth(ns, `border-${edge}-width`)) {
			let c = getBorderColor(ns, `border-${edge}-color`);	
			if(hasValidBorderColorAlpha(c)) {
				out.valid = true;
				out.color = c;
			}
		}
		return out;
	}

	if (node) {
		const nodeStyle = window.getComputedStyle(node);
		if (hasBorderImage(nodeStyle)) {
			return null; // - needs review
		}
		const result = CONSTANTS.BORDER_DIRECTIONS
			.reduce((out, direction) => {
				let b = getBorderColorIfValid(nodeStyle, direction);
				if(b.valid) {				
					out[direction] = b.color;
				}
				return out;
			}, {});
		return result;
	} else {
		throw new Error('Function color.getBorderColors expects an argument `node` of type Element - https://developer.mozilla.org/en-US/docs/Web/API/Element');
	}

}
