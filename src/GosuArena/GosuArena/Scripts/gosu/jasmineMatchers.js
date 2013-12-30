beforeEach(function () {
    this.addMatchers({
        toBeDefinedFunction: function() {
            var actualValue = this.actual;
            return actualValue && typeof actualValue === 'function';
        }
    });
});
