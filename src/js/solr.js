import fetch from "node-fetch";

export const USERNAME_FIELD = "user.name";
export const TEXT_FIELD = "text";
export const TIME_FIELD = "created_at";

export default class Solr {
    constructor(solrUrl = "http://52.174.37.46:8983/solr/tweets") {
        this.solrUrl = solrUrl;
    }

    async search(query, start = 0, rows = 10, filter, sort) {
        let sortvar = "";
        if(sort){
            sortvar = "user.followers_count desc"; 
        }

        return await this.postSolrRequest("select", {
            params: {
                fl: "*,*",
                df: "text",
                fq: filter,
                sort: sortvar,
                start: start,
                rows: rows,
            },
            query: {
                edismax: {
                    query,
                    qf: "text^5 user.name^1",
                },
            },
        });
    }

    async postSolrRequest(url, body) {
        const jsonResponse = await fetch(`${this.solrUrl}/${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        if (!jsonResponse.ok) {
            throw new Error(jsonResponse.statusText);
        }

        const response = await jsonResponse.json();
        if(url==="spell"){
            return response.spellcheck;
        }
        return response.response;
    }

    async recom(query){
        return await this.postSolrRequest("spell", {
            params: {
                wt: "json",
                spellcheck: "on",
                q: query
            }
        });
    }
}
