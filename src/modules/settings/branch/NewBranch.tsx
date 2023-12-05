import CreateBranchForm from "@/components/forms/branch/CreateBranchForm";
import AppRowContainer from "@/lib/AppRowContainer";
import { Breadcrumb, Card } from "antd";
import Link from "next/link";

import React from "react";

const NewBranch = () => {
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
              title: <Link href="/admin/settings/branch">Branch</Link>
            },
            {
              title: "New Branch"
            }
          ]}
        />

        <Card
          title="New Branch"
          style={{
            width: "80%",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            margin: "0 auto",
            textAlign: "center"
          }}
        >
          <CreateBranchForm />
        </Card>
      </AppRowContainer>
    </>
  );
};

export default NewBranch;
