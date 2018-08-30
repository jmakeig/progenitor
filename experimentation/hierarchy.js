/**
 * A tree data structure. Each node as a label and an ordered list of
 * `Hierarchy` children.
 */
export class Hierarchy {
  /**
   *
   * @param {Object} data
   * @param  {...Hierarchy} children
   */
  constructor(data, ...children) {
    this.data = data;
    this.children = children || [];
  }
}

/**
 * Whether there are children. Duck types for a `children` property with a
 * length greater than one.
 *
 * @param {Hierarchy} hierarchy
 * @return {boolean}
 */
export function hasChildren(hierarchy) {
  return hierarchy.children && hierarchy.children.length > 0;
}
/**
 * Depth-first traversal
 *
 * @param {Function} callback
 * @return {undefined}
 */
export function traverseDepthFirst(hierarchy, callback) {
  (function recurse(node, parent) {
    callback(node, parent);
    for (const child of node.children) {
      recurse(child, node);
    }
  })(hierarchy);
}
export function descendants(hierarchy, predicate = node => true) {
  const accum = [];
  traverseDepthFirst(hierarchy, node => {
    if (predicate(node)) accum.push(node);
  });
  return accum;
}
/**
 * The total number of *leaf nodes* underneath the current node.
 * This is useful for colspan on vertically-oriented hierarchies.
 *
 * @param {Hierarchy} hierarchy
 * @return {number}
 */
export function countDescendantLeaves(hierarchy) {
  // if (hasChildren(hierarchy)) {
  //   return hierarchy.children.reduce(
  //     (prev, curr) => prev + countDescendantLeaves(curr),
  //     0
  //   );
  // }
  // return 1;
  return descendants(hierarchy, node => !hasChildren(node)).length;
}
/**
 * The *maximum depth* under the current node. This is useful for rowspan in
 * vertically-oriented hierarchies.
 *
 * @param {Hierarchy} hierarchy
 * @return {number}
 */
export function maxDepth(hierarchy) {
  const max = (prev, curr) => Math.max(maxDepth(curr), prev);
  return 1 + (hasChildren(hierarchy) ? hierarchy.children.reduce(max, 0) : 0);
}

/**
 * Converts a dictionary-style `Object` into a `Hierarchy`, using the object’s
 * ennumerable properties.
 *
 * @param {*} obj
 * @return {Hierarchy}
 * @static
 */
Hierarchy.from = function from(obj) {
  // TODO
};
