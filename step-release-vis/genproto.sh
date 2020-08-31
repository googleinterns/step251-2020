PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
PROTO_PATH="./src/app/proto"
PROTOC_OUT_DIR="./src/app/proto/generated"
./node_modules/protoc/protoc/bin/protoc \
       --proto_path=${PROTO_PATH} \
       --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
       --js_out="import_style=commonjs,binary:${PROTOC_OUT_DIR}" \
       --ts_out="import_style=commonjs,binary:${PROTOC_OUT_DIR}" \
       data.proto
