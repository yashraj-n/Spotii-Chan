use {std::collections::HashMap, url::Url};
// Parses the response code from the URL
pub fn parse_response_code(url: &str) -> String {
    // Parses into URL
    let parsed = Url::parse(url).unwrap();
    // Creates hashmap of queries
    let hash_query: HashMap<_, _> = parsed.query_pairs().into_owned().collect();
    // Gets the code from the hashmap
    let code = &hash_query.get("code");
    let f = code.unwrap();
    return f.to_owned();
}
