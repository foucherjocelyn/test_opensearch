import os
from opensearchpy import OpenSearch


OPENSEARCH_HOST = os.getenv("OPENSEARCH_HOST")
OPENSEARCH_PORT = int(os.getenv("OPENSEARCH_PORT"))

client = OpenSearch(
    hosts=[{"host": OPENSEARCH_HOST, "port": OPENSEARCH_PORT}],
    http_compress=True,
    use_ssl=False,
    verify_certs=False,
)