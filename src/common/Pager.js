var Pager = (function () {
    function Pager(page, start, limit) {
        if (page === void 0) { page = 1; }
        if (start === void 0) { start = 0; }
        if (limit === void 0) { limit = 10; }
        this.page = page;
        this.start = start;
        this.limit = limit;
    }
    Pager.prototype.getPage = function () {
        return {
            page: this.page,
            start: this.start,
            limit: this.limit
        };
    };
    Pager.prototype.setNext = function () {
        this.page++;
        this.start = this.limit * (this.page - 1);
        return this;
    };
    Pager.prototype.setPage = function (page) {
        this.page = page;
        this.start = this.limit * (this.page - 1);
        return this;
    };
    Pager.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    Pager.prototype.clear = function () {
        this.resetStart();
        this.limit = 10;
        return this;
    };
    Pager.prototype.resetStart = function () {
        this.page = 1;
        this.start = 0;
        return this;
    };
    Pager.prototype.setStart = function (index) {
        this.start = index;
        this.page = index / this.limit + 1;
        return this;
    };
    Pager.prototype.getLimit = function (index) {
        var tempIndex = index + 1;
        var percent = parseInt((tempIndex / this.limit).toString());
        if (tempIndex % this.limit === 0) {
            return percent * this.limit;
        }
        return (percent + 1) * this.limit;
    };
    return Pager;
}());
export default Pager;
