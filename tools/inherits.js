/**
 * Created by admin on 2015/12/8.
 */

//javascript继承
exports.inherits = function(Child, Parent) {
    var F = function () {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}