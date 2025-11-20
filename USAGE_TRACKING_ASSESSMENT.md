# Usage Tracking & Quotas Implementation Status Report

## Executive Summary
**Status: INCOMPLETE AND BROKEN**
- Usage tracking is NOT implemented in either ParseCV.tsx or BulkParse.tsx
- Quota enforcement is NOT implemented
- Usage display is hardcoded with static values and not connected to any data source
- Critical API method `batchParse()` is MISSING from the API client

---

## Detailed Findings

### 1. ParseCV.tsx - Usage Tracking Integration
**Status: NOT IMPLEMENTED**

#### Current Implementation
- **Usage Display** (Lines 348-359):
  - Shows hardcoded values: "156 parses used" and "844 remaining"
  - These are static text values with no data binding
  - Not updated after parse operations

- **Parse Operation** (Lines 64-127):
  - Calls `parseScoreAPI.parseCV(file)` but no usage tracking increment
  - No quota check before parsing
  - No usage update after successful parse

- **Scoring Operation** (Lines 167-195):
  - Calls `parseScoreAPI.scoreCV()` with no usage tracking
  - No quota enforcement

#### Missing Components
- No `increment_parse_usage()` function call
- No `checkParseQuota()` or quota validation before parsing
- No state management for usage metrics
- No API call to fetch user's current usage/quota

---

### 2. BulkParse.tsx - Usage Tracking Integration
**Status: NOT IMPLEMENTED + CRITICAL BUG**

#### Current Implementation
- **Usage Display** (Lines 441-452):
  - Shows hardcoded values: "156 parses used" and "844 remaining"
  - Identical static values as ParseCV.tsx
  - Not updated after bulk parse operations

- **Bulk Parse Operation** (Lines 106-223):
  - Attempts to call `parseScoreAPI.batchParse()` at line 123 ❌ **FUNCTION DOES NOT EXIST**
  - No usage tracking increment after parsing
  - No quota check before processing multiple files

#### Critical Issues Found
1. **Missing API Method**: Line 123 calls `parseScoreAPI.batchParse()` but this method is NOT defined in parsescore-client.ts
2. **No Usage Tracking**: No calls to increment usage after successful parses
3. **No Quota Enforcement**: Can process unlimited files without checking remaining quota
4. **Hardcoded Usage Display**: Static values that never update

---

### 3. API Client Analysis

#### Current parseScoreAPI Methods (src/lib/api/parsescore-client.ts)
Available methods:
- `parseCV(file, persist)` - Single CV parsing
- `scoreCandidate(request)` - Scoring candidates
- `getCV(cvId)` - Retrieve parsed CV
- `listCVs(limit)` - List CVs
- `getScore(scoreId)` - Get score result
- `getCVScores(cvId)` - Get scores for a CV
- `healthCheck()` - Health check

#### Missing Methods
- ❌ `batchParse()` - **Called in BulkParse.tsx but NOT implemented**
- ❌ `increment_parse_usage()` - Usage tracking function
- ❌ `checkParseQuota()` - Quota validation function
- ❌ `getUsageStats()` - Fetch user's usage metrics

---

### 4. Usage Display Across Application

#### Hardcoded Usage Values Found
All display static values that never update:

| File | Location | Displayed Values |
|------|----------|------------------|
| ParseCV.tsx | Lines 351, 356 | 156 used / 844 remaining |
| BulkParse.tsx | Lines 444, 449 | 156 used / 844 remaining |
| Dashboard.tsx | Lines 67, 71, 200 | 156 used / 844 remaining, 156/1000 |
| DeveloperDashboard.tsx | Lines 115, 119, 248 | 156 used / 844 remaining, 156/1000 |
| Overview.tsx | Line 265 | 156/25000 |

#### Issues
- ✗ No state management for usage data
- ✗ No API call to fetch actual usage metrics
- ✗ Not updated when parse operations complete
- ✗ Not connected to user's actual quota/plan

---

### 5. Quota Enforcement Analysis

#### Quota Checking: NOT IMPLEMENTED
- **ParseCV.tsx**: No quota check before `handleParse()` (line 64)
- **BulkParse.tsx**: No quota check before `handleBulkParse()` (line 106)
- No validation of remaining quota
- No error handling for quota exceeded

#### Expected Implementation Pattern
```typescript
// What SHOULD happen:
const handleParse = async () => {
  // 1. Check if user has quota remaining
  const { remaining } = await fetchUserUsage();
  if (remaining <= 0) {
    toast({ title: "Quota Exceeded" });
    return;
  }
  
  // 2. Perform parse
  const result = await parseScoreAPI.parseCV(file);
  
  // 3. Increment usage counter
  await increment_parse_usage(1);
  
  // 4. Update display
  refetchUsage();
}
```

---

### 6. Recent Commits Analysis

#### Commit: `deb85f3` - "feat: add batch CV parsing with proper degree filtering"
**Date**: Nov 20, 2025

**Commit Message States**:
> "Add batchParse() method to parsescore-client for parsing CVs without scoring"

**Actual Changes**:
- ✓ Updated BulkParse.tsx to call `batchParse()` at line 123
- ✓ Added degree filtering logic
- ✓ Improved UI for file queue
- ✗ **BUT: parsescore-client.ts changes are NOT included in the diff**
- ✗ **Result: Code calls non-existent method**

---

## Implementation Checklist

### What Needs to Be Implemented

#### 1. API Client Enhancement
- [ ] Add `batchParse(files: File[])` method to ParseScoreAPI class
- [ ] Add `getUsageStats()` method to fetch current usage/quota
- [ ] Add `incrementParseUsage(count: number)` method
- [ ] Add `checkQuotaRemaining()` method

#### 2. ParseCV.tsx Updates
- [ ] Fetch actual usage data on component mount
- [ ] Add quota check before `handleParse()`
- [ ] Call `increment_parse_usage(1)` after successful parse
- [ ] Update usage display after each parse
- [ ] Handle quota exceeded errors

#### 3. BulkParse.tsx Updates
- [ ] Implement missing `batchParse()` method in API client
- [ ] Add quota check before `handleBulkParse()`
- [ ] Validate batch size against remaining quota
- [ ] Call `increment_parse_usage(successCount)` after batch completion
- [ ] Update usage display after bulk parse
- [ ] Handle quota exceeded errors with user feedback

#### 4. Usage Display Components
- [ ] Create UsageCard component with real data binding
- [ ] Add effect hook to refetch usage on mount and after operations
- [ ] Display accurate remaining quota
- [ ] Show upgrade prompt when near quota limit

#### 5. Data Management
- [ ] Add usage data to UserContext or new UsageContext
- [ ] Implement usage stats caching with expiry
- [ ] Add error handling for quota API calls

---

## Code Examples

### Missing batchParse() Implementation
```typescript
// Should be added to ParseScoreAPI class
async batchParse(files: File[]): Promise<{
  results: Array<{
    filename: string;
    candidate?: any;
    parsing_errors?: string;
  }>;
  processing_time_ms: number;
}> {
  const formData = new FormData();
  files.forEach((file, idx) => {
    formData.append(`files[${idx}]`, file);
  });

  return this.request('/v1/batch-parse', {
    method: 'POST',
    body: formData,
  });
}
```

### Missing Quota Check
```typescript
// Should be added before parse operations
const checkQuota = async () => {
  try {
    const stats = await parseScoreAPI.getUsageStats();
    if (stats.remaining <= 0) {
      toast({
        title: "Quota Exceeded",
        description: "Please upgrade your plan to continue parsing CVs.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to check quota:', error);
    return true; // Allow if check fails
  }
};
```

---

## Summary by Component

| Component | Tracking | Quota Check | Display | Status |
|-----------|----------|-------------|---------|--------|
| ParseCV.tsx | ❌ No | ❌ No | Hardcoded | 🔴 Not Implemented |
| BulkParse.tsx | ❌ No | ❌ No | Hardcoded | 🔴 Not Implemented + Broken |
| API Client | ❌ No methods | ❌ No methods | N/A | 🔴 Missing Methods |
| Usage Display | N/A | N/A | Static values | 🟡 Partially Implemented |

---

## Risk Assessment

### High Priority Issues
1. **Broken BulkParse**: Calls non-existent `batchParse()` method - will fail at runtime
2. **No Quota Enforcement**: Users can exceed their quota
3. **No Usage Tracking**: No accurate billing/usage accounting

### Medium Priority Issues
1. **Static Display Values**: Misleading to users about actual quota
2. **No Error Handling**: Quota exceeded not handled gracefully

### Low Priority Issues
1. **Inconsistent UI**: Different quota values across pages (156/1000 vs 156/25000)

---

## Recommendations

### Immediate Actions Required
1. Implement `batchParse()` method to fix broken BulkParse.tsx
2. Add quota checking before parse operations
3. Implement usage tracking/increment functions

### Short-term (Next Sprint)
1. Create reusable UsageCard component
2. Connect usage display to real data
3. Add quota exceeded error handling
4. Update all pages to use consistent quota display

### Long-term (Feature Enhancement)
1. Implement usage analytics dashboard
2. Add quota upgrade flow
3. Add usage warnings (80%, 95% of quota)
4. Implement rate limiting

