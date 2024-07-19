import { UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { Gate, useSubscription } from "use-stripe-subscription";

export default function Home() {
  const {
    isLoaded,
    products,
    subscription,
    redirectToCheckout,
    redirectToCustomerPortal,
  } = useSubscription();

  if (!isLoaded) {
    return null;
  }

  const alertResponse = async (path: string) => {
    const res = await fetch(path);
    const body = await res.text();
    alert(`Path requested: ${path}\nResponse: ${body}`);
  };

  return (
    <>
      <Head>
        <title>Web Application</title>
      </Head>
      <header>
        <h1>Option Data</h1>
        <h2>Dashboard</h2>
        <h2>Plans</h2>
        <UserButton />
      </header>
      <main>
        {products.map(({ product, prices }) => (
          <div key={product.id}>
            <h4>{product.name}</h4>
            <Gate unsubscribed>
              {prices.map((price) => (
                <button
                  key={price.id}
                  onClick={() => redirectToCheckout({ price: price.id })}
                >
                  Purchase {price.unit_amount} {price.currency}
                </button>
              ))}
            </Gate>
            <Gate product={product}>Active plan</Gate>
            {/* <Gate product={product} negate>
              <button onClick={() => redirectToCustomerPortal()}>
                Change plan
              </button>
            </Gate> */}
          </div>
        ))}
        <div className="center-content">
          <h2>Features</h2>
          <Gate feature="feature1">Plan has &quot;feature1&quot;</Gate>
          <Gate feature="feature1" negate>
            Plan does not have &quot;feature1&quot;
          </Gate>{" "}
          <button onClick={() => alertResponse("/api/tryFeature1")}>
            Test the backend!
          </button>
        </div>
        <div className="center-content">
          <Gate feature="feature2">Plan has &quot;feature2&quot;</Gate>
          <Gate feature="feature2" negate>
            Plan does not have &quot;feature2&quot;
          </Gate>{" "}
          <button onClick={() => alertResponse("/api/tryFeature2")}>
            Test the backend!
          </button>
        </div>
        <h2>Account management</h2>
      </main>
    </>
  );
}
