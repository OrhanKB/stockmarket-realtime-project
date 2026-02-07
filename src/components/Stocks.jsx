import { useFinnhub } from "../hooks/useFinnhub";

function Stocks() {
    const { sections, status } = useFinnhub();

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px", fontWeight: "bold", color: status === "Connected" ? "green" : "orange" }}>
                Status: {status}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {sections.map((section) => (
                    <div key={section.id} style={{ flex: 1, margin: "0 10px" }}>
                        <h2>{section.title}</h2>
                        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                            {section.items.map(item => (
                                <div key={item.symbol} style={{ borderBottom: "1px solid #eee", padding: "10px", display: "flex", justifyContent: "space-between" }}>
                                    <strong>{item.symbol}</strong>
                                    <span>
                                        {item.price ? `$${item.price}` : <span style={{ color: "#999" }}>Waiting...</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Stocks;