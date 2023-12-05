import CreateOwnerForm from "@/components/forms/owner/CreateOwnerForm";
import AppRowContainer from "@/lib/AppRowContainer";
import { Breadcrumb, Card } from "antd";
import Link from "next/link";

import React from "react";

const NewOwner = () => {
  return (
    <>
      <AppRowContainer>
        <Breadcrumb
          style={{
            margin: "10px 30px",
            textAlign: "left"
          }}
          items={[
            {
              title: <Link href="/admin">Home</Link>
            },
            {
              title: <Link href="/admin/settings">Settings</Link>
            },
            {
              title: <Link href="/admin/settings/owner">Owners</Link>
            },
            {
              title: "New Owner"
            }
          ]}
        />

        <Card
          title="New Owner"
          style={{
            width: "80%",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            margin: "0 auto",
            textAlign: "center"
          }}
        >
          <CreateOwnerForm />
        </Card>
      </AppRowContainer>
    </>
  );
};

export default NewOwner;
