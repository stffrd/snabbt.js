// Update element Transform
function transform(element, matrix, property, perspective, transform) {
    const css = {
        perspective : perspective ? `perspective(${perspective}px) ` : "",
        matrix      : matrix.asCSS(),
        transform   : transform ? transform : ""
    };

    const prop  = property ? property : "transform";
    const value = `${css.transform}${css.perspective}${css.matrix}`;

    element.style[prop] = value;
}

// Update Element Properties
function properties(element, properties) {
    // Preserve perspective
    Object.assign(element.style, properties, { perspective : element.style.perspective });
}

export default {
    update : {
        transform,
        properties
    }
};

