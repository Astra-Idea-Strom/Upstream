# NEEDS-HUMAN-REVIEW.MD: Escalation Register for Edge-Case & Ambiguous Skills

> **Purpose**: Formal staging register for domain capabilities, emergent technologies, or safety-critical integrations where automated certainty is insufficient and human/senior review (e.g. Claude Opus or domain specialist) is required.  
> **Policy**: In accordance with Rule #7 of the Universal Skill System, never hallucinate or invent speculative instructions. If high-confidence authoritative documentation cannot be verified, log the skill here.

---

## 1. Active Review Queue

### Entry 1: `advanced-webgpu-compute`
- **Skill Name**: `advanced-webgpu-compute`
- **Target Category**: `frontend/3d-web`
- **Purpose**: Low-level GPGPU computing in browser runtimes using WGSL (WebGPU Shading Language) for client-side ML tensor operations and fluid simulation.
- **Why It Is Needed**: Emerging workloads (e.g. running quantized Whisper or small vision models directly in-browser via WebGPU) require direct pipeline creation, bind group layouts, and workgroup barrier synchronization.
- **Research Found**:
  - W3C WebGPU Working Draft (2026 update).
  - WebGPU specification (`w3.org/TR/webgpu/`).
  - WGSL specification (`w3.org/TR/wgsl/`).
- **Recommended Sources**:
  - Official W3C WebGPU Editor's Draft.
  - Google Chrome WebGPU Samples repository.
  - Mozilla Developer Network WebGPU API documentation.
- **What the Skill Should Eventually Contain**:
  1. WebGPU device and adapter initialization with fallback to WebGL2.
  2. Compute pipeline creation with `@compute @workgroup_size(...)` shaders.
  3. Buffer allocation, storage buffer mapping, and GPU-to-CPU readback pipelines.
  4. Workgroup memory synchronization and barrier primitives.
  5. Memory leak detection and GPU buffer destruction lifecycle.
- **What Remains Uncertain**:
  - WGSL memory barrier semantics across heterogeneous Android mobile GPUs.
  - Thermal throttling characteristics when compute shaders run continuously alongside UI rendering.
  - Fast-changing Safari WebGPU implementation specifics.

---

### Entry 2: `clinical-decision-support-compliance`
- **Skill Name**: `clinical-decision-support-compliance`
- **Target Category**: `domains/health-wellness-safety`
- **Purpose**: Strict FDA SaMD (Software as a Medical Device) and EU MDR (Medical Device Regulation) boundary compliance for AI applications touching health metrics.
- **Why It Is Needed**: Hackathon problem statements 31-34 involve health navigation, medication explanation, and habit coaching. Crossing the line into diagnostic or clinical advice creates severe regulatory liability.
- **Research Found**:
  - FDA Guidance on Clinical Decision Support Software (2022/revised).
  - EU MDR Annex VIII classification rules for software.
  - WHO Ethics and Governance of AI for Health guidelines.
- **Recommended Sources**:
  - FDA.gov Digital Health Center of Excellence.
  - European Commission Medical Device Guidelines (MDCG).
- **What the Skill Should Eventually Contain**:
  1. Algorithmic checklist differentiating non-diagnostic lifestyle wellness from regulated CDS software.
  2. Concrete prompt phrasing rules ensuring AI never outputs diagnostic conclusions or drug dosage adjustments.
  3. Automated triage classification detecting 25 acute emergency indicators requiring immediate emergency redirection.
  4. Audit trail and validation methodology for clinical disclaimers.
- **What Remains Uncertain**:
  - Exact regional jurisdictional boundaries for LLM-synthesized summaries brought to a physician.
  - Liability implications of AI-identified drug-drug interactions when grounded in public datasets.

---

### Entry 3: `decentralized-zk-proof-verification`
- **Skill Name**: `decentralized-zk-proof-verification`
- **Target Category**: `security/cryptography`
- **Purpose**: Zero-Knowledge (ZK) SNARK/STARK proof verification in web clients for anonymous authentication and private credential verification.
- **Why It Is Needed**: High-privacy consumer applications seeking passwordless, identity-proving authentication without revealing user PII.
- **Research Found**:
  - Circom and SnarkJS in browser environments.
  - Trail of Bits Zero-Knowledge auditing research.
- **Recommended Sources**:
  - `iden3/snarkjs` documentation and benchmarks.
  - Trail of Bits cryptography research publications.
- **What the Skill Should Eventually Contain**:
  1. In-browser proof generation performance budgets (WASM vs native).
  2. Trusted setup ceremony artifact loading and caching in Service Workers.
  3. Constant-time proof validation on server runtimes.
- **What Remains Uncertain**:
  - WASM memory limits on mobile Safari during large constraint system verification.

---

## 2. Resolution Protocol
When a human engineer or senior model reviews these entries:
1. Verify research against official specifications.
2. Draft the dedicated `SKILL.md` in the target directory following `SKILL-DEVELOPMENT.md`.
3. Register the new skill in `skills-index.json`.
4. Remove the entry from this queue or mark as `RESOLVED` with the resolution date.
