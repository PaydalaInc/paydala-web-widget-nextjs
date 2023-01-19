# Get NPM packages
FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
ARG NPM_TOKEN  
COPY .npmrc.docker .npmrc  
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile
RUN rm -f .npmrc

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

ARG user=nextjs
ARG group=nodejs
ARG usergroup=${user}:${group}
RUN addgroup --system --gid 1001 ${group}
RUN adduser --system --uid 1001 ${user}

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=${usergroup} /app/.next/standalone ./
COPY --from=builder --chown=${usergroup} /app/.next/static ./.next/static

USER ${user}

EXPOSE 3000

CMD [“node”, “server.js”]
