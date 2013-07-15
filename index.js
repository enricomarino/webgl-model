
/**
 * Expose component
 */

module.exports = function (context) {
  
  /**
   * Model
   * Create a model.
   * @param {Object} options The options for creating the model.
   *   @param {Float32Array} [options.vertices] The vertices of the model.
   *   @param {Uint16Array} [options.indices] The indices of the model.
   *   @param {Float32Array} [options.colors] The per-vertex color.
   *   @param {Number} [options.drawType] The WebGL primitive type.
   *   @param {Boolean} [options.dynamic] The flag for caching the geometry.
   * @return {Model} The model.
   * @api public
   */

  function Model (options) {
    var options = options || {};

    this.id = guid();
    this.vertices = options.vertices;
    this.indices = options.indices;
    this.colors = options.colors;
    this.drawType = options.drawType || context.TRIANGLES;
    this.dynamic = options.dynamic || false;
  };

  /**
   * Model#bind_verticex
   * Bind the vertices of this model to a shader program.
   * @param {Program} program The program to bind the vertices to.
   * @param {Boolean} update The flat to cache the vertices.
   * @return {Model} this for chaining.
   * @api public 
   */

  Model.prototype.bind_vertices = function (program, update) {
    if (!this.vertices) {
      return this;
    }
    
    if (update || this.dynamic) {
      program.bindAttribute(context, this.id + '-vertices', {
        name: 'a_position',
        data: this.vertices,
        size: 3
      });
      return this;
    }

    program.bindAttribute(context, this.id + '-vertices');

    return this;
  };
  
  /**
   * Model#bind_colors
   * Bind the colors of this model to a shader program.
   * @param {WebGLRenderingContext} context A WebGL rendering context.
   * @param {Program} program The program to bind the colors to.
   * @param {Boolean} update The flag to cache the colors.
   * @return {Model} this for chaining.
   * @api public
   */ 

  Model.prototype.bind_colors = function (program, update) {
    if (!this.colors) {
      return this;
    }
    
    if (update || this.dynamic) {
      program.bindAttribute(context, this.id + '-colors', {
        name : 'a_color',
        data: this.colors,
        size: 4
      });
      return this;
    } 

    program.bindAttribute(context, this.id + '-colors');
    return this;
  };

  /**
   * Model#bind_indices
   * Bind the indices of this model to a shader program.
   * @param {WebGLRenderingContext} context A WebGL rendering context.
   * @param {Program} program The program to bind the indices.
   * @param {Boolean} update Avoid using cached indices.
   * @return {Model} this for chaining.
   * @api public
   */

  Model.prototype.bind_indices = function (program, update) {
    if (!this.indices) {
      return this;
    }
    
    if (update || this.dynamic) {
      program.bindAttribute(context, this.id + '-indices', {
          attributeType: gl.ELEMENT_ARRAY_BUFFER
        , data: this.indices
      });
      return this;
    }

    program.bindAttribute(context, this.id + '-indices');
    return this;
  };

  /**
   * Model#draw
   * Draw this Model.
   * @param {WebGLRenderingContext} context A WebGL rendering context.
   * @return {Model} this for chaining.
   * @api public
   */
  
  Model.prototype.draw = function () {
    if (this.indices) {
      context.drawElements(this.drawType, this.indices.length, gl.UNSIGNED_SHORT, 0);
      return this;
    }
    if (this.vertices) {
      context.drawArrays(this.drawType, 0, this.vertices.length / 3);
      return this;
    }
    return this;
  };
  
  return Model;
};
