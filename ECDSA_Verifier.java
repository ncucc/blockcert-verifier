import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.Signature;
import java.security.interfaces.ECPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

public class ECDSA_Verifier {
    private static final String EC = "EC";
    private static final String SHA256_WITH_ECDSA = "SHA256withECDSA";


    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("usage: java ECDSA_Verifier file");
            System.exit(-2);
        }

        try (Stream<String> lines = Files.lines(Paths.get(args[0]), StandardCharsets.UTF_8)) {
            AtomicInteger i = new AtomicInteger(-1);

            String []inputData = new String[] { "", "", "" };

            lines.forEach(s -> {
                if (i.incrementAndGet() < inputData.length) {
                    inputData[i.get()] = s.trim();
                }
            });

            byte[] decode = Base64.getUrlDecoder().decode(inputData[0]);
            byte[] sig = Base64.getUrlDecoder().decode(inputData[1]);
            byte[] data = inputData[2].getBytes(StandardCharsets.UTF_8);

            KeyFactory kf = KeyFactory.getInstance(EC);

            ECPublicKey ecPublicKey = (ECPublicKey) kf.generatePublic(new X509EncodedKeySpec(decode));

            Signature verifier = Signature.getInstance(SHA256_WITH_ECDSA);
            verifier.initVerify(ecPublicKey);
            verifier.update(data);

            if (verifier.verify(sig)) {
                System.out.println("ok");
                System.exit(0);
            } else {
                System.out.println("failed");
                System.exit(1);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.exit(-1);
        }
    }
}
