import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class WebServer {

    private static final String PRODUCT_JSON ="["
        
+ "{"
        + "\"id\":1,"
        + "\"name\":\"Wireless Earbuds\","
        + "\"price\":1499,"
        + "\"image\":\"images/earbuds.jpg\","
        + "\"description\":\"High-quality wireless earbuds with deep bass and long battery life.\","
        + "\"reviews\":["
        + "{\"user\":\"Darsha\",\"rating\":5,\"comment\":\"Amazing sound quality!\"},"
        + "{\"user\":\"prisha\",\"rating\":4,\"comment\":\"Good product for this price.\"}"
        + "]"
        + "},"

        + "{"
        + "\"id\":2,"
        + "\"name\":\"Smart Watch\","
        + "\"price\":2499,"
        + "\"image\":\"images/watch.jpg\","
        + "\"description\":\"Smart fitness watch with heart-rate monitoring and 7-day battery life.\","
        + "\"reviews\":["
        + "{\"user\":\"Priya\",\"rating\":3,\"comment\":\"Very stylish and smooth!\"},"
        + "{\"user\":\"anshu\",\"rating\":4,\"comment\":\"Good features.\"}"
        + "]"
        + "},"

        + "{"
        + "\"id\":3,"
        + "\"name\":\"Bluetooth Speaker\","
        + "\"price\":999,"
        + "\"image\":\"images/speaker.jpg\","
        + "\"description\":\"Portable Bluetooth speaker with loud sound and deep bass.\","
        + "\"reviews\":["
        + "{\"user\":\"Sneha\",\"rating\":5,\"comment\":\"Great for parties!\"}"
        + "]"
        + "},"

        + "{"
        + "\"id\":4,"
        + "\"name\":\"Power Bank\","
        + "\"price\":1299,"
        + "\"image\":\"images/powerbank.jpg\","
        + "\"description\":\"10,000mAh fast-charging power bank for all devices.\","
        + "\"reviews\":["
        + "{\"user\":\"nirav\",\"rating\":4,\"comment\":\"Charges fast.\"}"
        + "]"
        + "},"

        + "{"
        + "\"id\":5,"
        + "\"name\":\"Neckband\","
        + "\"price\":699,"
        + "\"image\":\"images/neckband.jpg\","
        + "\"description\":\"Lightweight neckband with powerful bass and noise isolation.\","
        + "\"reviews\":["
        + "{\"user\":\"nanni\",\"rating\":5,\"comment\":\"Very comfortable!\"}"
        + "]"
        + "},"

        + "{"
        + "\"id\":6,"
        + "\"name\":\"Smartphone Case\","
        + "\"price\":599,"
        + "\"image\":\"images/case.jpg\","
        + "\"description\":\"Strong shockproof smartphone case with modern design.\","
        + "\"reviews\":[]"
        + "},"

        + "{"
        + "\"id\":7,"
        + "\"name\":\"Portable Charger\","
        + "\"price\":1799,"
        + "\"image\":\"images/charger.jpg\","
        + "\"description\":\"Ultra-fast 22.5W portable charger for all smartphones.\","
        + "\"reviews\":["
        + "{\"user\":\"monika\",\"rating\":5,\"comment\":\"Very good for travel.\"}"
        + "]"
        + "},"

        + "{"
        + "\"id\":8,"
        + "\"name\":\"Wireless Mouse\","
        + "\"price\":899,"
        + "\"image\":\"images/mouse.jpg\","
        + "\"description\":\"Smooth, ergonomic wireless mouse with 2-year battery life.\","
        + "\"reviews\":["
        + "{\"user\":\"Amit\",\"rating\":4,\"comment\":\"Works perfectly.\"}"
        + "]"
        + "}"

    + "]";
    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(new InetSocketAddress(9090), 0);

        server.createContext("/products", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {

                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");

                byte[] resp = PRODUCT_JSON.getBytes("UTF-8");

                exchange.sendResponseHeaders(200, resp.length);

                OutputStream os = exchange.getResponseBody();
                os.write(resp);
                os.close();
            }
        });

        System.out.println("Products API running on http://localhost:9090/products");
        server.start();
    }
}
