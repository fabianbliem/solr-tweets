import fetch from "node-fetch";

export const USERNAME_FIELD = "user.name";
export const TEXT_FIELD = "text";

export default class Solr {
    constructor(solrUrl = "http://52.174.37.46:8983/solr/tweets") {
        this.solrUrl = solrUrl;
    }

    async commit() {
        await this.postSolrRequest("update?commit=true");
    }

    async addDocument(uniqueId, fields) {
        await this.postSolrRequest("update?overwrite=true&commitWithin=1000", [{ id: uniqueId, ...fields }]);
    }

    async deleteAll() {
        await this.postSolrRequest("update?commit=true", {
            delete: {
                query: "*:*",
            },
        });
    }

    async search(query, start = 0, rows = 10, filter) {
        console.log(query);
        console.log(filter);

        return await this.postSolrRequest("select", {
            params: {
                fl: "*,*",
                df: "text",
                fq: filter,
                start: start,
                rows: rows,
                /* TODO: Put further common query parameters (https://lucene.apache.org/solr/guide/common-query-parameters.html) here. */
            },
            query: {
                edismax: {
                    query,
                     qf: "text^5 user.name^1",
                    // mm: "100%",
                    /* TODO: Put further edismax query parameters (https://lucene.apache.org/solr/guide/8_5/the-extended-dismax-query-parser.html) here. */
                },
            },
        });
    }

    async postSolrRequest(url, body){
        const jsonResponse = await fetch(`${this.solrUrl}/${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        // console.log(jsonResponse)

        if (!jsonResponse.ok) {
            throw new Error(jsonResponse.statusText);
        }

        const response = await jsonResponse.json();
        return response.response;
    }
}
