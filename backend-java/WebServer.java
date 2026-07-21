import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.io.File;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

public class WebServer {
    private static final String FRONTEND_DIR = "../frontend";
    
    public static void startServer() {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            server.createContext("/products", new ProductHandler());
            server.createContext("/", new StaticFileHandler());
            server.setExecutor(null);
            server.start();
            System.out.println("Server started at http://localhost:8080");
            System.out.println("Serving files from: " + new File(FRONTEND_DIR).getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static class ProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            
            // Handle OPTIONS request for CORS preflight
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                exchange.close();
                return;
            }
            
            // Get the host from the request to build full URLs
            String host = exchange.getRequestHeaders().getFirst("Host");
            if (host == null || host.isEmpty()) {
                host = "localhost:8080";
            }
            String baseUrl = "http://" + host;
            
            // Fixed image paths to match actual file names - using full URLs
            String json = "["
                + "{\"id\":1,\"name\":\"Wireless Headphones\",\"price\":1499,\"image\":\"" + baseUrl + "/images/headphones.jpg\"},"
                + "{\"id\":2,\"name\":\"Smart Watch\",\"price\":1999,\"image\":\"" + baseUrl + "/images/smartwatch.jpg\"},"
                + "{\"id\":3,\"name\":\"Bluetooth Speaker\",\"price\":999,\"image\":\"" + baseUrl + "/images/speaker.jpg\"},"
                + "{\"id\":4,\"name\":\"Gaming Mouse\",\"price\":799,\"image\":\"" + baseUrl + "/images/GamingMouse.jpg\"},"
                + "{\"id\":5,\"name\":\"Laptop Stand\",\"price\":599,\"image\":\"" + baseUrl + "/images/laptopsatnd.jpg\"},"
                + "{\"id\":6,\"name\":\"USB-C Hub\",\"price\":499,\"image\":\"" + baseUrl + "/images/USBchub.jpg\"}"
                + "]";
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());
            OutputStream os = exchange.getResponseBody();
            os.write(json.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            os.close();
        }
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers for all static files
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            
            String path = exchange.getRequestURI().getPath();
            
            // Default to index.html for root path
            if (path.equals("/") || path.equals("")) {
                path = "/index.html";
            }
            
            // Remove leading slash for file path
            String filePath = FRONTEND_DIR + path;
            File file = new File(filePath);
            
            if (!file.exists() || !file.isFile()) {
                // File not found
                String response = "404 Not Found";
                exchange.sendResponseHeaders(404, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }
            
            // Determine content type
            String contentType = "text/plain";
            if (path.endsWith(".html")) {
                contentType = "text/html";
            } else if (path.endsWith(".css")) {
                contentType = "text/css";
            } else if (path.endsWith(".js")) {
                contentType = "application/javascript";
            } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (path.endsWith(".png")) {
                contentType = "image/png";
            } else if (path.endsWith(".gif")) {
                contentType = "image/gif";
            }
            
            // Read and send file
            byte[] fileBytes = Files.readAllBytes(Paths.get(filePath));
            exchange.getResponseHeaders().add("Content-Type", contentType);
            exchange.sendResponseHeaders(200, fileBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(fileBytes);
            os.close();
        }
    }
}
