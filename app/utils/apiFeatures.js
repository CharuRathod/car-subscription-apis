class APIFeatures {

    constructor(query, queryString) {

        this.query = query;
        this.queryString = queryString;
    }


    // SEARCH
    search(searchFields = []) {

        if (this.queryString.search) {

            const searchQuery = {

                $or: searchFields.map((field) => ({

                    [field]: {
                        $regex: this.queryString.search,
                        $options: "i"
                    }

                }))
            };

            this.query = this.query.find(searchQuery);
        }

        return this;
    }


    // FILTER
    filter(filterFields = []) {

        const filters = {};

        filterFields.forEach((field) => {

            if (this.queryString[field]) {

                filters[field] = this.queryString[field];
            }

        });

        this.query = this.query.find(filters);

        return this;
    }


    // PAGINATION
    pagination() {

        const page = Number(this.queryString.page) || 1;

        const limit = Number(this.queryString.limit) || 10;

        const skip = (page - 1) * limit;


        this.query = this.query
            .skip(skip)
            .limit(limit);


        return this;
    }

}


export default APIFeatures;